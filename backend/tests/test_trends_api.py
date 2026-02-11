"""
Backend API Tests for TikTok Automation App
Tests: Trends CRUD, Niches Recommended, Dashboard Stats
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

if not BASE_URL:
    # Fallback for testing
    BASE_URL = "https://tiktok-creator-134.preview.emergentagent.com"


class TestHealthCheck:
    """Health check endpoint test"""
    
    def test_health_endpoint(self):
        """Test /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data
        print(f"✓ Health check passed: {data}")


class TestTrendsAPI:
    """Tests for /api/trends endpoints - POST, GET, DELETE"""
    
    @pytest.fixture
    def test_trend_data(self):
        """Generate unique test trend data"""
        return {
            "title": f"TEST_Trend_{uuid.uuid4().hex[:8]}",
            "niche": "test_niche",
            "views": 100000,
            "engagement": 15000,
            "url": "https://www.tiktok.com/@test/video/123"
        }
    
    def test_add_trend_success(self, test_trend_data):
        """Test POST /api/trends - Add a new trend"""
        response = requests.post(f"{BASE_URL}/api/trends", json=test_trend_data)
        
        # Status assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert "message" in data
        assert "id" in data
        assert data["message"] == "Tendance ajoutée avec succès"
        assert isinstance(data["id"], str)
        assert len(data["id"]) > 0
        
        print(f"✓ Trend added successfully with ID: {data['id']}")
        
        # Cleanup - delete the test trend
        requests.delete(f"{BASE_URL}/api/trends/{data['id']}")
        return data["id"]
    
    def test_add_trend_and_verify_persistence(self, test_trend_data):
        """Test POST /api/trends then GET to verify data persisted"""
        # CREATE
        create_response = requests.post(f"{BASE_URL}/api/trends", json=test_trend_data)
        assert create_response.status_code == 200
        trend_id = create_response.json()["id"]
        
        # GET to verify persistence
        get_response = requests.get(f"{BASE_URL}/api/trends")
        assert get_response.status_code == 200
        
        trends_data = get_response.json()
        assert "trends" in trends_data
        
        # Find our created trend
        created_trend = None
        for trend in trends_data["trends"]:
            if trend["_id"] == trend_id:
                created_trend = trend
                break
        
        assert created_trend is not None, f"Created trend {trend_id} not found in GET response"
        assert created_trend["title"] == test_trend_data["title"]
        assert created_trend["niche"] == test_trend_data["niche"]
        assert created_trend["views"] == test_trend_data["views"]
        assert created_trend["engagement"] == test_trend_data["engagement"]
        
        print(f"✓ Trend persisted and verified: {created_trend['title']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/trends/{trend_id}")
    
    def test_add_trend_missing_required_fields(self):
        """Test POST /api/trends with missing required fields"""
        incomplete_data = {
            "title": "Test Trend"
            # Missing: niche, views, engagement
        }
        response = requests.post(f"{BASE_URL}/api/trends", json=incomplete_data)
        
        # Should return 422 for validation error
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Validation error returned for missing fields")
    
    def test_list_trends(self):
        """Test GET /api/trends - List all trends"""
        response = requests.get(f"{BASE_URL}/api/trends")
        
        assert response.status_code == 200
        data = response.json()
        
        # Data structure assertions
        assert "trends" in data
        assert "count" in data
        assert isinstance(data["trends"], list)
        assert isinstance(data["count"], int)
        assert data["count"] == len(data["trends"])
        
        # If trends exist, verify structure
        if data["trends"]:
            trend = data["trends"][0]
            assert "_id" in trend
            assert "title" in trend
            assert "niche" in trend
            assert "views" in trend
            assert "engagement" in trend
        
        print(f"✓ Listed {data['count']} trends successfully")
    
    def test_list_trends_with_niche_filter(self, test_trend_data):
        """Test GET /api/trends with niche filter"""
        # First create a trend with specific niche
        test_trend_data["niche"] = "filter_test_niche"
        create_response = requests.post(f"{BASE_URL}/api/trends", json=test_trend_data)
        trend_id = create_response.json()["id"]
        
        # Filter by niche
        response = requests.get(f"{BASE_URL}/api/trends", params={"niche": "filter_test_niche"})
        assert response.status_code == 200
        
        data = response.json()
        # All returned trends should have the filtered niche
        for trend in data["trends"]:
            assert trend["niche"] == "filter_test_niche"
        
        print(f"✓ Niche filter working correctly")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/trends/{trend_id}")
    
    def test_delete_trend_success(self, test_trend_data):
        """Test DELETE /api/trends/{id} - Delete a trend"""
        # First create a trend
        create_response = requests.post(f"{BASE_URL}/api/trends", json=test_trend_data)
        trend_id = create_response.json()["id"]
        
        # DELETE
        delete_response = requests.delete(f"{BASE_URL}/api/trends/{trend_id}")
        assert delete_response.status_code == 200
        
        data = delete_response.json()
        assert data["message"] == "Tendance supprimée"
        
        # Verify deletion - trend should not exist
        get_response = requests.get(f"{BASE_URL}/api/trends")
        trends = get_response.json()["trends"]
        trend_ids = [t["_id"] for t in trends]
        assert trend_id not in trend_ids, "Trend should be deleted"
        
        print(f"✓ Trend {trend_id} deleted and verified")
    
    def test_delete_trend_not_found(self):
        """Test DELETE /api/trends/{id} with non-existent ID"""
        fake_id = str(uuid.uuid4())
        response = requests.delete(f"{BASE_URL}/api/trends/{fake_id}")
        
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        print(f"✓ 404 returned for non-existent trend")


class TestNichesAPI:
    """Tests for /api/niches endpoints"""
    
    def test_get_recommended_niches(self):
        """Test GET /api/niches/recommended"""
        response = requests.get(f"{BASE_URL}/api/niches/recommended")
        
        assert response.status_code == 200
        data = response.json()
        
        # Data structure assertions
        assert "niches" in data
        assert "count" in data
        assert isinstance(data["niches"], list)
        
        # If niches exist, verify structure
        if data["niches"]:
            niche = data["niches"][0]
            assert "name" in niche
            # Niches should have profitability_score for recommendations
            if "profitability_score" in niche:
                assert isinstance(niche["profitability_score"], (int, float))
        
        print(f"✓ Got {data['count']} recommended niches")
    
    def test_get_recommended_niches_with_limit(self):
        """Test GET /api/niches/recommended with limit parameter"""
        response = requests.get(f"{BASE_URL}/api/niches/recommended", params={"limit": 2})
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data["niches"]) <= 2
        print(f"✓ Limit parameter working: got {len(data['niches'])} niches")


class TestDashboardAPI:
    """Tests for /api/dashboard endpoints"""
    
    def test_get_dashboard_stats(self):
        """Test GET /api/dashboard/stats"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats")
        
        assert response.status_code == 200
        data = response.json()
        
        # Required fields in dashboard stats
        required_fields = ["total_trends", "total_videos", "total_niches", "total_views", "total_revenue", "top_videos"]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        
        # Type assertions
        assert isinstance(data["total_trends"], int)
        assert isinstance(data["total_videos"], int)
        assert isinstance(data["total_niches"], int)
        assert isinstance(data["total_views"], (int, float))
        assert isinstance(data["total_revenue"], (int, float))
        assert isinstance(data["top_videos"], list)
        
        print(f"✓ Dashboard stats: {data['total_trends']} trends, {data['total_videos']} videos, {data['total_niches']} niches")


class TestAnalyticsAPI:
    """Tests for /api/analytics endpoints"""
    
    def test_list_analytics(self):
        """Test GET /api/analytics"""
        response = requests.get(f"{BASE_URL}/api/analytics")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "analytics" in data
        assert "count" in data
        assert isinstance(data["analytics"], list)
        
        print(f"✓ Listed {data['count']} analytics records")


class TestVideosAPI:
    """Tests for /api/videos endpoints (excluding generation which is skeleton)"""
    
    def test_list_videos(self):
        """Test GET /api/videos"""
        response = requests.get(f"{BASE_URL}/api/videos")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "videos" in data
        assert "count" in data
        assert isinstance(data["videos"], list)
        
        print(f"✓ Listed {data['count']} videos")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
