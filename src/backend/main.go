

package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/PuerkitoBio/goquery"
	"gorm.io/driver/mysql"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type URL struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	UUID          string    `json:"uuid" gorm:"type:varchar(36);uniqueIndex"`
	URL           string    `json:"url"`
	Title         string    `json:"title"`
	HTMLVersion   string    `json:"html_version"`
	InternalLinks int       `json:"internal_links"`
	ExternalLinks int       `json:"external_links"`
	BrokenLinks   int       `json:"broken_links"`
	HasLoginForm  bool      `json:"has_login_form"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

var DB *gorm.DB

func initDB() {
	dsn := os.Getenv("MYSQL_DSN") 
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to DB: ", err)
	}
	if err := db.AutoMigrate(&URL{}); err != nil {
		log.Fatal("AutoMigrate failed: ", err)
	}

	DB = db
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token != "Bearer c88f69b89f1e478a9cf32be8720d54d7ab3ff6f4b9272f6f" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		c.Next()
	}
}

func main() {
	err := godotenv.Load()
  	if err != nil {
    	log.Fatal("Error loading .env file")
  	}
	initDB()
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	r.Use(authMiddleware())
	
	r.POST("/api/urls", func(c *gin.Context) {
	var body struct {
		URL string `json:"url"`
	}
	if err := c.BindJSON(&body); err != nil {
		log.Println("Failed to parse JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	uuidStr := uuid.New().String()
	entry := URL{UUID: uuidStr, URL: body.URL, Status: "queued"}

	if err := DB.Create(&entry).Error; err != nil {
		log.Println("Failed to create DB entry:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	go analyzeURL(entry.ID, body.URL)

	c.JSON(http.StatusCreated, entry)
})

r.DELETE("/api/urls/delete", func(c *gin.Context) {
	var body struct {
		IDs []uint `json:"ids"`
	}
	log.Println("Failed to parse JSON:", body.IDs)
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if len(body.IDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No IDs provided"})
		return
	}

	if err := DB.Delete(&URL{}, body.IDs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete URLs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "URLs deleted successfully"})
})


	r.GET("/api/urls", func(c *gin.Context) {
	var urls []URL

	if err := DB.Order("id desc").Find(&urls).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch URLs"})
		return
	}

	c.JSON(http.StatusOK, urls)
})


	r.GET("/api/urls/:id", func(c *gin.Context) {
		var url URL
		if err := DB.First(&url, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusOK, url)
	})

	r.Run(":8080")
}

func analyzeURL(id uint, inputURL string) {
	DB.Model(&URL{}).Where("id = ?", id).Update("status", "running")

	resp, err := http.Get(inputURL)
	if err != nil {
		DB.Model(&URL{}).Where("id = ?", id).Update("status", "error")
		return
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		DB.Model(&URL{}).Where("id = ?", id).Update("status", "error")
		return
	}

	title := doc.Find("title").Text()
	htmlVersion := "HTML5" 

	internalLinks := 0
	externalLinks := 0
	brokenLinks := 0
	loginForm := false

	doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
		href, _ := s.Attr("href")
		if strings.HasPrefix(href, "/") || strings.Contains(href, inputURL) {
			internalLinks++
		} else {
			externalLinks++
		}

		client := http.Client{Timeout: 5 * time.Second}
		linkResp, err := client.Get(href)
		if err != nil || linkResp.StatusCode >= 400 {
			brokenLinks++
		}
	})

	doc.Find("form").Each(func(i int, s *goquery.Selection) {
		if s.Find("input[type='password']").Length() > 0 {
			loginForm = true
		}
	})

	DB.Model(&URL{}).Where("id = ?", id).Updates(URL{
		Title:         title,
		HTMLVersion:   htmlVersion,
		InternalLinks: internalLinks,
		ExternalLinks: externalLinks,
		BrokenLinks:   brokenLinks,
		HasLoginForm:  loginForm,
		Status:        "done",
	})
}
