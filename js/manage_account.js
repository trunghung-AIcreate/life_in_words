//tao birn luu 1 account nd
const defaultAccount = {
    username: "huatrunghung1210",
    password: "hung1210"
}
if (!localStorage.getItem("defaultAccount")){
// neu chua co du lieu trong storage => tao
// JSON (chuoi - string): kieu du lieu dung de luu vao trong storage => js khong doc duoc
// => chuyen kieu du lieu tu js -> json = func stringify()
    localStorage.getItem("defaultAccount", JSON.stringify(defaultAccount)) 
}