// Survey form submission handler
const BACKEND_URL = 'http://localhost:3000/api/survey';

document.getElementById('surveyForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('.submit-btn');
  const statusDiv = document.getElementById('submitStatus');

  // รวบรวมข้อมูล
  const formData = new FormData(form);
  const data = {
    category: form.dataset.category,
    topic: form.dataset.topic,
    ratings: {
      q1: parseInt(formData.get('q1')),
      q2: parseInt(formData.get('q2')),
      q3: parseInt(formData.get('q3')),
    },
    comment: formData.get('comment') || '',
    submittedAt: new Date().toISOString(),
  };

  // ตรวจสอบว่ากรอกครบ
  if (!data.ratings.q1 || !data.ratings.q2 || !data.ratings.q3) {
    statusDiv.hidden = false;
    statusDiv.className = 'submit-status error';
    statusDiv.textContent = 'กรุณาตอบคำถามให้ครบทุกข้อ';
    return;
  }

  // ส่งข้อมูล
  submitBtn.disabled = true;
  submitBtn.textContent = 'กำลังส่ง...';

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Server error');

    statusDiv.hidden = false;
    statusDiv.className = 'submit-status success';
    statusDiv.textContent = '✅ ส่งแบบประเมินเรียบร้อยแล้ว ขอบคุณครับ/ค่ะ';
    form.reset();
  } catch (err) {
    statusDiv.hidden = false;
    statusDiv.className = 'submit-status error';
    statusDiv.textContent = '❌ เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองอีกครั้ง';
    console.error('Submit error:', err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'ส่งแบบประเมิน';
  }
});
