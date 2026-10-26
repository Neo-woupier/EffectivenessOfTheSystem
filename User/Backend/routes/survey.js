const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// โฟลเดอร์เก็บข้อมูล
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'surveys.json');

// สร้างโฟลเดอร์และไฟล์ถ้ายังไม่มี
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

// อ่านข้อมูลทั้งหมด
function readSurveys() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

// เขียนข้อมูล
function writeSurveys(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// POST /api/survey — รับแบบประเมินใหม่
router.post('/', (req, res) => {
  try {
    const { category, topic, ratings, comment, submittedAt } = req.body;

    // Validate
    if (!category || !topic || !ratings) {
      return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
    }

    if (!ratings.q1 || !ratings.q2 || !ratings.q3) {
      return res.status(400).json({ error: 'กรุณาตอบคำถามให้ครบทุกข้อ' });
    }

    const surveys = readSurveys();

    const newEntry = {
      id: Date.now().toString(),
      category,
      topic,
      ratings,
      comment: comment || '',
      submittedAt: submittedAt || new Date().toISOString(),
    };

    surveys.push(newEntry);
    writeSurveys(surveys);

    res.status(201).json({
      message: 'บันทึกแบบประเมินสำเร็จ',
      data: newEntry,
    });
  } catch (err) {
    console.error('Error saving survey:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
});

// GET /api/survey — ดึงแบบประเมินทั้งหมด
router.get('/', (req, res) => {
  try {
    const surveys = readSurveys();

    // กรองตาม query params (optional)
    let filtered = surveys;
    if (req.query.category) {
      filtered = filtered.filter(s => s.category === req.query.category);
    }
    if (req.query.topic) {
      filtered = filtered.filter(s => s.topic === req.query.topic);
    }

    res.json({
      total: filtered.length,
      data: filtered,
    });
  } catch (err) {
    console.error('Error reading surveys:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอ่านข้อมูล' });
  }
});

module.exports = router;
