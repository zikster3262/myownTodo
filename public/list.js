let table = document.querySelector(".table-body");
let documentBody = document.body;

let changeNoteName = document.querySelector(".update_note_name");
let changeNoteText = document.querySelector(".update_note_text");
let changeNoteDate = document.querySelector(".update_note_date");

document.addEventListener(
  "DOMContentLoaded",
  function () {
    axios
      .get("/get-notes")
      .then((response) => {
        const data = response.data.data;
        data.forEach((item, i) => {
          table.insertAdjacentHTML(
            "beforeend",
            ` 
            <tr>
              <th scope="row">${i}</th>
                <td>${item._id}</td>
                <td>${item.note_name}</td>
                <td>${item.note_text}</td>
                <td>${item.note_date}</td>
                <td><button type="button" data-id="${item._id}" class="edit-me btn btn-primary" data-toggle="modal" data-target="#modalLong">Edit</button></td>
                <td><button type="button" data-id="${item._id}" class="delete-me btn btn-danger">Delete</button></td>
            </tr>
            `
          );
        });
      })
      .catch((error) => console.log(error));
  },
  false
);

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-me")) {
    axios
      .post("/find", {
        id: e.target.getAttribute("data-id"),
      })
      .then(function (result) {
        changeNoteName.value = result.data.data.note_name;
        changeNoteText.value = result.data.data.note_text;
        changeNoteDate.value = result.data.data.note_date;
        document
          .getElementById("save-me")
          .setAttribute("data-id", `${result.data.data._id}`);
      })
      .catch(function () {
        console.log("Please try it later on!");
      });
  }
  // console.log(e.target.dataset.id);
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("save-me")) {
    axios
      .post("/update", {
        id: e.target.getAttribute("data-id"),
        note_name: changeNoteName.value,
        note_text: changeNoteText.value,
        note_date: changeNoteDate.value,
      })
      .then(function (result) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch(function () {
        console.log("Please try it later on!");
      });
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-me")) {
    axios
      .post("/delete", {
        id: e.target.getAttribute("data-id"),
      })
      .then(function (result) {
        console.log("Record Deleted");
        window.location.reload();
      })
      .catch(function () {
        console.log("Please try it later on!");
      });
  }
});
