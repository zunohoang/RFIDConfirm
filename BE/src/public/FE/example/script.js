// ... (Phần JavaScript trước đó)

// Thêm Học phần
function addCourse() {
    var courseName = document.getElementById("courseName").value;

    if (courseName) {
        var listItem = document.createElement("li");
        listItem.innerHTML = "<strong>" + courseName + "</strong>";

        document.getElementById("courseList").appendChild(listItem);

        // Clear input field
        document.getElementById("courseName").value = "";
    } else {
        alert("Vui lòng điền tên học phần.");
    }
}

// Điểm danh
function markAttendance() {
    var date = document.getElementById("date").value;
    var studentIdAttendance = document.getElementById("studentIdAttendance").value;

    if (date && studentIdAttendance) {
        var listItem = document.createElement("li");
        listItem.innerHTML = "<strong>" + date + ":</strong> Sinh viên " + studentIdAttendance + " đã điểm danh.";

        document.getElementById("attendanceList").appendChild(listItem);

        // Clear input fields
        document.getElementById("date").value = "";
        document.getElementById("studentIdAttendance").value = "";
    } else {
        alert("Vui lòng điền đầy đủ thông tin điểm danh.");
    }
}
