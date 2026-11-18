// Danh sách từ vựng theo chủ đề.
// Thêm từ: bỏ ảnh vào images/<id>/<từ>.png (khoảng trắng đổi thành "-", vd "teddy bear" -> teddy-bear.png)
// rồi thêm từ vào mảng words. Mỗi chủ đề cần ít nhất 9 từ.
const TOPICS = [
  { id: "animals", name: "Animals", words: ["bird", "cat", "chicken", "cow", "dog", "duck", "elephant", "fish", "frog", "horse", "lion", "monkey", "pig", "rabbit", "tiger"] },
  { id: "fruits", name: "Fruits", words: ["apple", "banana", "cherry", "coconut", "grapes", "kiwi", "mango", "orange", "pear", "pineapple", "strawberry", "watermelon"] },
  { id: "school", name: "School things", words: ["bag", "book", "chair", "clock", "computer", "crayon", "paper clip", "pen", "pencil", "ruler", "scissors"] },
  { id: "toys", name: "Toys", words: ["ball", "balloon", "bike", "boat", "car", "drum", "kite", "plane", "puzzle", "robot", "teddy bear", "train", "yo-yo"] },
];
