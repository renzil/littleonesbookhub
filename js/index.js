const SPREADSHEET_ID = "1qA6bdIiZSv09FA5qgXhq0nRj_PeTWgp0ufYFmWqeDfM";
const GOOGLE_CLOUD_API_KEY = "AIzaSyC6lEYx6meglfkrIRHxixxRuYwk9UGtAzM";

function onScroll() {
        window.onscroll = function() {
        if (window.pageYOffset > 0) {
          document.querySelector('.desktopNav').classList.add('scrolled')
          document.querySelector('.mobileNav').classList.add('scrolled')
        } else {
          document.querySelector('.desktopNav').classList.remove('scrolled')
          document.querySelector('.mobileNav').classList.add('scrolled')
        }
        }
}

function fetch_collections() {
    show_collections_loading_spinner();
    fetch("https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID + "?key=" + GOOGLE_CLOUD_API_KEY + "&includeGridData=true")
        .then(response => response.json())
        .then(result => {
            let collections = {};
            const spreadsheet = result;
            spreadsheet.sheets.forEach(function(sheet) {
                if (sheet.properties.title === "collections") {
                    sheet.data.forEach(function(gridData) {
                        gridData.rowData.forEach(function(row, index) {
                          if (index < 1) { // header in spreadsheet
                            return;
                          }
                          try {
                            const id = row.values[0].formattedValue ? row.values[0].formattedValue : "";
                            const name = row.values[1].formattedValue ? row.values[1].formattedValue : "";
                            let books = row.values[2].formattedValue ? row.values[2].formattedValue : "";
                            books = books.replaceAll(' ', '');
                            books = books.split(",");
                            if (name === "") {
                              return;
                            }
                            collections[id] =  {id: id, name: name, books: books};
                          } catch(err) {
                            console.error(err);
                          }
                        });
                    });
                }
            });
            return collections;     
        })
        .then(collections => on_collections_fetched(collections))
        .finally(() => {
            hide_collections_loading_spinner();
        });
}

function show_collections_loading_spinner() {
}

function hide_collections_loading_spinner() {
}

function on_collections_fetched(collections) {
    console.log(collections);
}

function openMenu() {
  var x2 = document.getElementById("mobile-nav-links")
  var x1 = document.querySelector('.mobileNav')
  if (x2.style.display === "block"){
    x1.classList.remove("mobileNavOpen");
    x2.style.display = "none"; 
    
  }
  else {
    x1.classList.add("mobileNavOpen");
    x2.style.display = "block";
    
  }
  
}

function on_page_load() {
    fetch_collections();
    onScroll();
}

window.onload = on_page_load;