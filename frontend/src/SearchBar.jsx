export default function SearchBar() {
  return (
    <div style={{ display: "flex", alignItems: "center", border: "1px solid #d3d3d3", width: "250px", height: "40px" }}>
      
      <input 
        type="text" 
        placeholder="Search" 
        style={{ border: "none", padding: "0 15px", height: "100%", flexGrow: 1, outline: "none", fontSize: "1rem", backgroundColor: "transparent"}} 
      />
      
      <div style={{ backgroundColor: "#f8f8f8", height: "100%", padding: "0 15px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderLeft: "1px solid #e0e0e0" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      
    </div>
  );
}