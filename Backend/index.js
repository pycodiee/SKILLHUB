require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create necessary database tables if they don't exist
async function setupDatabase() {
  try {
    // Create course_progress table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS course_progress (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES users(id),
        video_id INTEGER REFERENCES videos(id),
        progress_percentage INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT false,
        last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, video_id)
      )
    `);
    
    // Create student_learning_data table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_learning_data (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES users(id),
        video_id INTEGER REFERENCES videos(id),
        goals TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, video_id)
      )
    `);
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error setting up database tables:', error);
  }
}

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, userType, usn, contact } = req.body;
    
    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, user_type, usn, contact) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, hashedPassword, userType, usn, contact]
    );

    res.status(201).json({ 
      success: true,
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        userType: newUser.rows[0].user_type
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ 
      success: true,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        userType: user.rows[0].user_type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/google-auth', async (req, res) => {
  try {
    const { credential } = req.body;
    console.log('Received credential:', credential);
    
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, sub: googleId } = ticket.getPayload();
    console.log('Google payload:', { name, email, googleId });

    // Check if user exists
    let user = await pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    if (user.rows.length === 0) {
      // Create new user
      user = await pool.query(
        'INSERT INTO users (name, email, google_id, user_type) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, googleId, 'student']
      );
    }

    res.json({ 
      success: true,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        userType: user.rows[0].user_type
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// Add multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads', 'videos'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Not a video file'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Update the video upload endpoint
app.post('/api/videos', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { title, subject, teacherName, description } = req.body;
    const video_url = `/uploads/videos/${req.file.filename}`;

    console.log('File uploaded:', req.file);
    console.log('Form data:', req.body);

    const newVideo = await pool.query(
      'INSERT INTO videos (title, subject, teacher_id, description, video_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, subject, req.body.teacher_id, description, video_url]
    );

    res.json({ 
      success: true, 
      video: newVideo.rows[0],
      message: 'Video uploaded successfully'
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload video', 
      error: error.message 
    });
  }
});

// Modify the get videos endpoint
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await pool.query(`
      SELECT 
        v.*,
        u.name as teacher_name,
        COUNT(cp.id) as student_count,
        AVG(cp.progress_percentage) as average_progress
      FROM videos v 
      JOIN users u ON v.teacher_id = u.id
      LEFT JOIN course_progress cp ON v.id = cp.video_id
      GROUP BY v.id, u.name
      ORDER BY v.created_at DESC
    `);

    res.json({ success: true, videos: videos.rows });
  } catch (error) {
    console.error('Fetch videos error:', error);
    res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
  }
});

// Add endpoint to update course progress
app.post('/api/course-progress', async (req, res) => {
  try {
    const { student_id, video_id, progress_percentage, completed } = req.body;

    const result = await pool.query(`
      INSERT INTO course_progress (student_id, video_id, progress_percentage, completed, last_watched_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (student_id, video_id) 
      DO UPDATE SET 
        progress_percentage = $3,
        completed = $4,
        last_watched_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [student_id, video_id, progress_percentage, completed]);

    res.json({ success: true, progress: result.rows[0] });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
});

// Update student profile and skills
app.post('/api/student/profile', async (req, res) => {
  try {
    const { user_id, github_profile, languages, tools } = req.body;
    
    // Update profile
    await pool.query(
      'INSERT INTO student_profiles (user_id, github_profile) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET github_profile = $2, updated_at = CURRENT_TIMESTAMP',
      [user_id, github_profile]
    );

    // Update skills
    for (const [lang, active] of Object.entries(languages)) {
      await pool.query(
        'INSERT INTO student_skills (student_id, skill_name, skill_type, is_active) VALUES ($1, $2, $3, $4) ON CONFLICT (student_id, skill_name) DO UPDATE SET is_active = $4, updated_at = CURRENT_TIMESTAMP',
        [user_id, lang, 'language', active]
      );
    }

    for (const [tool, active] of Object.entries(tools)) {
      await pool.query(
        'INSERT INTO student_skills (student_id, skill_name, skill_type, is_active) VALUES ($1, $2, $3, $4) ON CONFLICT (student_id, skill_name) DO UPDATE SET is_active = $4, updated_at = CURRENT_TIMESTAMP',
        [user_id, tool, 'tool', active]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Get student progress
app.get('/api/student/progress/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    
    const skills = await pool.query(
      'SELECT skill_name, skill_type, proficiency FROM student_skills WHERE student_id = $1 AND is_active = true',
      [student_id]
    );

    const courseProgress = await pool.query(
      'SELECT v.title, cp.progress_percentage FROM course_progress cp JOIN videos v ON cp.video_id = v.id WHERE cp.student_id = $1',
      [student_id]
    );

    const learningTrack = await pool.query(
      'SELECT * FROM learning_tracks WHERE student_id = $1',
      [student_id]
    );

    res.json({
      success: true,
      progress: {
        skills: skills.rows,
        courses: courseProgress.rows,
        track: learningTrack.rows[0]
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

// Get teacher's students progress
app.get('/api/teacher/students-progress/:teacher_id', async (req, res) => {
  try {
    const { teacher_id } = req.params;
    
    const progress = await pool.query(`
      SELECT 
        u.name as student_name,
        v.title as video_title,
        cp.progress_percentage,
        cp.completed,
        cp.last_watched_at
      FROM course_progress cp
      JOIN users u ON cp.student_id = u.id
      JOIN videos v ON cp.video_id = v.id
      WHERE v.teacher_id = $1
      ORDER BY cp.last_watched_at DESC
    `, [teacher_id]);

    res.json({ success: true, progress: progress.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students progress' });
  }
});

// Endpoint to get available courses for students
app.get('/api/available-courses/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    
    // Get all videos with teacher info
    const availableCourses = await pool.query(`
      SELECT 
        v.id,
        v.title,
        v.subject,
        v.description,
        v.video_url,
        v.created_at,
        u.name as teacher_name,
        COALESCE(cp.progress_percentage, 0) as progress,
        COALESCE(cp.completed, false) as completed
      FROM videos v
      JOIN users u ON v.teacher_id = u.id
      LEFT JOIN course_progress cp ON v.id = cp.video_id AND cp.student_id = $1
      ORDER BY v.created_at DESC
    `, [student_id]);
    
    res.json({ success: true, courses: availableCourses.rows });
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ message: 'Failed to fetch available courses' });
  }
});

// Update student course progress
app.post('/api/student/course-progress', async (req, res) => {
  try {
    const { student_id, video_id, progress_percentage, completed } = req.body;
    
    // Update progress or create new entry if it doesn't exist
    const result = await pool.query(
      `INSERT INTO course_progress 
        (student_id, video_id, progress_percentage, completed, last_watched_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (student_id, video_id) 
       DO UPDATE SET 
        progress_percentage = $3, 
        completed = $4, 
        last_watched_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [student_id, video_id, progress_percentage, completed]
    );
    
    res.json({ success: true, progress: result.rows[0] });
  } catch (error) {
    console.error('Error updating course progress:', error);
    res.status(500).json({ message: 'Failed to update course progress' });
  }
});

// Add learning goals and notes for students
app.post('/api/student/learning-data', async (req, res) => {
  try {
    const { student_id, video_id, goals, notes } = req.body;
    
    const result = await pool.query(
      `INSERT INTO student_learning_data 
        (student_id, video_id, goals, notes, created_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (student_id, video_id) 
       DO UPDATE SET 
        goals = $3, 
        notes = $4, 
        updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [student_id, video_id, goals, notes]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving learning data:', error);
    res.status(500).json({ message: 'Failed to save learning data' });
  }
});

// Get student learning data for a specific video
app.get('/api/student/learning-data/:student_id/:video_id', async (req, res) => {
  try {
    const { student_id, video_id } = req.params;
    
    const data = await pool.query(
      `SELECT * FROM student_learning_data 
       WHERE student_id = $1 AND video_id = $2`,
      [student_id, video_id]
    );
    
    res.json({ 
      success: true, 
      data: data.rows.length > 0 ? data.rows[0] : { goals: '', notes: '' } 
    });
  } catch (error) {
    console.error('Error fetching learning data:', error);
    res.status(500).json({ message: 'Failed to fetch learning data' });
  }
});

// Get detailed student progress for teachers
app.get('/api/teacher/detailed-progress/:teacher_id', async (req, res) => {
  try {
    const { teacher_id } = req.params;
    
    // Get all students who have watched the teacher's videos
    const studentsProgress = await pool.query(`
      SELECT 
        u.id as student_id,
        u.name as student_name,
        u.email as student_email,
        json_agg(
          json_build_object(
            'video_id', v.id,
            'video_title', v.title,
            'subject', v.subject,
            'progress', cp.progress_percentage,
            'completed', cp.completed,
            'last_watched', cp.last_watched_at
          )
        ) as course_progress,
        COUNT(CASE WHEN cp.completed = true THEN 1 END) as completed_courses,
        COUNT(v.id) as total_courses,
        ROUND(AVG(cp.progress_percentage)) as average_progress
      FROM users u
      JOIN course_progress cp ON u.id = cp.student_id
      JOIN videos v ON cp.video_id = v.id
      WHERE v.teacher_id = $1 AND u.user_type = 'student'
      GROUP BY u.id, u.name, u.email
      ORDER BY u.name
    `, [teacher_id]);
    
    res.json({ success: true, students: studentsProgress.rows });
  } catch (error) {
    console.error('Error fetching detailed progress:', error);
    res.status(500).json({ message: 'Failed to fetch detailed progress' });
  }
});

// Get learning goals and notes for teacher review
app.get('/api/teacher/student-learning-data/:teacher_id', async (req, res) => {
  try {
    const { teacher_id } = req.params;
    
    const learningData = await pool.query(`
      SELECT 
        u.name as student_name,
        v.title as video_title,
        sld.goals,
        sld.notes,
        sld.created_at,
        sld.updated_at
      FROM student_learning_data sld
      JOIN users u ON sld.student_id = u.id
      JOIN videos v ON sld.video_id = v.id
      WHERE v.teacher_id = $1
      ORDER BY sld.updated_at DESC
    `, [teacher_id]);
    
    res.json({ success: true, learningData: learningData.rows });
  } catch (error) {
    console.error('Error fetching student learning data:', error);
    res.status(500).json({ message: 'Failed to fetch student learning data' });
  }
});

// Student Dashboard - Get recommended courses based on skills
app.get('/api/student/recommended-courses/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    
    // Get student's active skills
    const skills = await pool.query(
      'SELECT skill_name FROM student_skills WHERE student_id = $1 AND is_active = true',
      [student_id]
    );
    
    const skillNames = skills.rows.map(row => row.skill_name);
    
    // Find courses that match student skills (basic recommendation)
    let recommendedCourses;
    if (skillNames.length > 0) {
      const skillConditions = skillNames.map((_, i) => `v.subject ILIKE $${i + 2}`).join(' OR ');
      
      recommendedCourses = await pool.query(`
        SELECT 
          v.id,
          v.title,
          v.subject,
          v.description,
          u.name as teacher_name,
          COALESCE(cp.progress_percentage, 0) as progress
        FROM videos v
        JOIN users u ON v.teacher_id = u.id
        LEFT JOIN course_progress cp ON v.id = cp.video_id AND cp.student_id = $1
        WHERE ${skillConditions}
        ORDER BY cp.progress_percentage ASC NULLS FIRST
        LIMIT 5
      `, [student_id, ...skillNames.map(s => `%${s}%`)]);
    } else {
      // If no skills, recommend newest courses
      recommendedCourses = await pool.query(`
        SELECT 
          v.id,
          v.title,
          v.subject,
          v.description,
          u.name as teacher_name,
          COALESCE(cp.progress_percentage, 0) as progress
        FROM videos v
        JOIN users u ON v.teacher_id = u.id
        LEFT JOIN course_progress cp ON v.id = cp.video_id AND cp.student_id = $1
        ORDER BY v.created_at DESC
        LIMIT 5
      `, [student_id]);
    }
    
    res.json({ success: true, courses: recommendedCourses.rows });
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    res.status(500).json({ message: 'Failed to fetch recommended courses' });
  }
});

// Call database setup on server start
setupDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});