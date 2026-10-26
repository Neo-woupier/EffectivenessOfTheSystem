
const items = document.querySelectorAll(".item");

items.forEach((item) => {
  item.addEventListener("click", () => {
    const category = item.querySelector(".item-title").textContent;
    console.log("หมวดหมู่ที่เลือก:", category);
    // ลิงก์จะทำงานปกติผ่าน href ของ <a> tag
  });
});
