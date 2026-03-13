function SearchBar({ onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const query = e.target.elements.search.value
    if (query.trim()) onSearch(query)
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <form onSubmit={handleSubmit}>
        <input
          name="search"
          type="text"
          placeholder="Search for a recipe... (e.g. pasta)"
          style={{ padding: "10px", width: "300px", fontSize: "16px" }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px", marginLeft: "10px", fontSize: "16px" }}
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar