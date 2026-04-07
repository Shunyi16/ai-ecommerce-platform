import SearchBar from "./SearchBar";

export default function Navbar({ cartCount, cartOnClick, accountOnClick, itemOnClick }) {
    return (

        <header style={{ width: "100%", marginBottom: "30px" }}>
            {/* top row */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 40px",
                marginBottom: "20px",
            }}>
                <SearchBar /> {/* leftside: search div */}
                <h1 style={{
                    margin: 0,
                    fontSize: "3rem",
                    letterSpacing: "1px",
                    position: "absolute", /* 2. Pulls it out of the Flexbox flow */
                    left: "50%",            /* 3. Pushes the left edge to the exact center */
                    transform: "translateX(-50%)"   /* 4. Pulls it back by half its own width to perfectly center it */
                }}>
                    Lamps
                </h1>
                <div style={{ width: "200px" }}></div>  {/* rightsie: bookend */}
                <div style={{ display: "flex", gap: "20px" }}>
                    <span onClick={accountOnClick} style={{ cursor: "pointer" }}>👤 Account</span>
                    <span onClick={cartOnClick} style={{ cursor: "pointer" }}>🛒 Cart ({cartCount}) </span>
                </div>
            </div>

            {/* bottom row */}
            <nav style={{
                display: "flex",
                justifyContent: "center",
                gap: "30px",
                padding: "15px 0",
                fontSize: "1rem",
                letterSpacing: "1px",
                borderTop: "1px solid #eaeaea",
                borderBottom: "1px solid #eaeaea",
                marginBottom: "20px",
            }}>
                <span onClick={itemOnClick} style={{ cursor: "pointer", fontWeight: "500", wordSpacing: "-2px" }}> Ceiling Lights </span>
                <span onClick={itemOnClick} style={{ cursor: "pointer", fontWeight: "500", wordSpacing: "-2px" }}> Lamps </span>
                <span onClick={itemOnClick} style={{ cursor: "pointer", fontWeight: "500", wordSpacing: "-2px" }}> Ceiling Fans </span>
                <span onClick={itemOnClick} style={{ cursor: "pointer", fontWeight: "500", wordSpacing: "-2px" }}> Outdoor Lights </span>
                <span onClick={itemOnClick} style={{ cursor: "pointer", fontWeight: "500", wordSpacing: "-2px" }}> Wall Lights </span>
                <span onClick={itemOnClick} style={{ cursor: "pointer", fontWeight: "500", wordSpacing: "-2px" }}> Decor </span>
                <span onClick={itemOnClick} style={{ cursor: "pointer", fontWeight: "500", wordSpacing: "-2px", color: "red" }}> Sale </span>
            </nav>
        </header>
    );
}
