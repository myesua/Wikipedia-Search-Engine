// Take user input as string and make it a parameter for wikipediaSearch

const handleSubmit = async(e) => {
  e.preventDefault();
  const inputText = document.querySelector('#search-input-js').value;
  const searchQuery = inputText.trim();

  // Reference the element to display result
  const searchResults = document.querySelector('#search-results-js');
  // Clear previous search results
  searchResults.innerHTML = '';

  // Remove hidden class from spinner
  const spinner = document.querySelector('#spinner-js');
  const footer = document.querySelector('#footer-js');
  spinner.classList.remove('hidden');
  footer.classList.remove('hidden');
 
  try {
   const results = await searchWikipedia(searchQuery);
   if (results.query.searchinfo.totalhits === 0) {
     searchResults.innerHTML = "No results were found! Please try different keywords."
     footer.classList.add('hidden');
   }
   displayResults(results);
  } catch(error) {
   console.log(error);
   alert('Failed to search Wikipedia!');
  } finally {
    spinner.classList.add('hidden');
  }
  
 }

// Get `search query` from submit function, append it to the endpoint, fetch and return result
const searchWikipedia = async(searchQuery) => {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw Error(response.statusText);
  }

  const data = await response.json();
  return data;
}

// Display result to DOM
const displayResults = (results) => {
  // Reference the element to display result
  const searchResults = document.querySelector('#search-results-js');

  // Iterate over `search array` of results query
  results.query.search.forEach(result => {
    const pageUrl = `https://en.wikipedia.org/?curid=${result.pageid}`;
    
    // Append `result` from iteration to HTML DOM
    searchResults.insertAdjacentHTML(
      'beforeend',
      `<div class="result-section">
        <h3 class="result-title">
          <a href="${pageUrl} target="_blank" rel="noopener">${result.title}</a>
        </h3>
        <a class="result-link" href="${pageUrl} target="_blank" rel="noopener">${pageUrl}</a>
        <span class="result-snippet">${result.snippet}</span>
        <br />
      </div>`
    )
  }); 
}


const SUBMIT = 'submit';

const form = document.querySelector('#search-box-js');
form.addEventListener(SUBMIT, handleSubmit);
