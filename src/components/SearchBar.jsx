function SearchBar({ onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const query = e.target.elements.search.value.trim()
    if (query) onSearch(query)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "8px", marginBottom: "24px" }}
    >
      <input
        name="search"
        type="text"
        placeholder="Search Indian recipes... (e.g. biryani, dal, paneer)"
        style={{
          flex: 1,
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid #333",
          background: "#2a2a2a",
          color: "#f0f0f0",
          fontSize: "15px",
          outline: "none"
        }}
      />
      <button
        type="submit"
        style={{
          padding: "12px 24px",
          background: "#ff9800",
          border: "none",
          borderRadius: "10px",
          color: "#000",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "15px"
        }}
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar