/**
 * Client API pour communiquer avec le backend
 */

const API_BASE_URL = 'http://localhost:8000';

class APIClient {
    constructor() {
        this.token = localStorage.getItem('auth_token');
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders()
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: 'Request failed' }));
                throw new Error(error.detail || `HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Auth
    async requestMagicLink(email) {
        return this.request('/auth/magic-link', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    async verifyToken(token) {
        const response = await this.request('/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ token })
        });
        
        this.token = response.access_token;
        localStorage.setItem('auth_token', response.access_token);
        return response;
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    logout() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }

    isAuthenticated() {
        return !!this.token;
    }

    // Lessons
    async getLessons() {
        return this.request('/lessons');
    }

    async getLesson(lessonId) {
        return this.request(`/lessons/${lessonId}`);
    }

    // Exercises
    async getExercise(exerciseId) {
        return this.request(`/exercises/${exerciseId}`);
    }

    // Submissions
    async submitSolution(exerciseId, code, passed, passedCount, totalCount, runtimeMs, errorMessage = '') {
        return this.request('/submissions', {
            method: 'POST',
            body: JSON.stringify({
                exercise_id: exerciseId,
                code,
                passed,
                passed_count: passedCount,
                total_count: totalCount,
                runtime_ms: runtimeMs,
                error_message: errorMessage
            })
        });
    }

    async getMySubmissions(limit = 20) {
        return this.request(`/submissions/me?limit=${limit}`);
    }

    async getExerciseSubmissions(exerciseId) {
        return this.request(`/submissions/exercise/${exerciseId}`);
    }

    async getMyProgress() {
        return this.request('/submissions/me/progress');
    }
}

// Instance globale
const api = new APIClient();

