let form = document.querySelector(".form-one");
let submitButton = document.querySelector(".note-submit");
let noteName = document.querySelector(".note-name");
let noteText = document.querySelector(".note-text");
let noteDate = document.querySelector(".note-date");
let testText = document.querySelector(".test-text");
let infoText = document.querySelector(".creation-info");

function submitForm() {
  // console.log(noteName.value);
  // console.log(noteText.value);
  // console.log(noteDate.value);
  if (noteName.value == "" || noteText.value == "" || noteDate.value == "") {
    infoText.textContent = "Please Insert All Information.";
    return false; // Prevent page refresh
  } else {
    axios
      .post("/create-note", {
        note_name: noteName.value,
        note_text: noteText.value,
        note_date: noteDate.value,
      })
      .then(function (response) {
        console.log("note created successfully");
      })
      .catch(function () {
        console.log("Please try it later on!");
      });
    var frm = document.querySelector(".form-one");
    frm.submit(); // Submit the form
    frm.reset(); // Reset all form data
    return false; // Prevent page refresh
  }
}
