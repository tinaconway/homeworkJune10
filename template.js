var templates = {};

// single post template
templates.post = [
  "<article class='post' data-id='<%= _id %>'>",
  "<div class='element'><input class='checklist' type='checkbox'> <%= toDo %></input></div>",
  "<div class='edit'>",
  "<input type='text' class='editContent' value='<%= toDo %>'>",
  "<button type='button' class='submitEdit btn'>Update</button>",
  "</div>",
  "</article>"
].join("");

templates.leftoverItems = [
  "<%= count %>",
  "<span> Items Left</span>"


].join("");
