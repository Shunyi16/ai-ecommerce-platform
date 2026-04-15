// Standard US State Tax Rates (2024 Average Combined Rates)
export const taxRates = {
    "AL": 0.0929, "AK": 0.0182, "AZ": 0.0840, "AR": 0.0947, "CA": 0.0725,
    "CO": 0.0810, "CT": 0.0635, "DE": 0.0000, "FL": 0.0702, "GA": 0.0735,
    "HI": 0.0444, "ID": 0.0603, "IL": 0.0886, "IN": 0.0700, "IA": 0.0694,
    "KS": 0.0875, "KY": 0.0600, "LA": 0.0955, "ME": 0.0550, "MD": 0.0600,
    "MA": 0.0625, "MI": 0.0600, "MN": 0.0750, "MS": 0.0707, "MO": 0.0839,
    "MT": 0.0000, "NE": 0.0701, "NV": 0.0823, "NH": 0.0000, "NJ": 0.0660,
    "NM": 0.0762, "NY": 0.0452, "NC": 0.0699, "ND": 0.0697, "OH": 0.0724,
    "OK": 0.0899, "OR": 0.0000, "PA": 0.0634, "RI": 0.0700, "SC": 0.0743,
    "SD": 0.0640, "TN": 0.0955, "TX": 0.0820, "UT": 0.0719, "VT": 0.0624,
    "VA": 0.0575, "WA": 0.0940, "WV": 0.0655, "WI": 0.0543, "WY": 0.0544
};

/**
 * Calculates a complete order summary based on cart items and shipping destination.
 */
export const calculateOrderTotals = (cartItems, shippingState) => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantitySelected, 0);
    
    const stateKey = shippingState?.trim().toUpperCase();
    const currentTaxRate = taxRates[stateKey] || 0;
    
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantitySelected, 0);
    const taxAmount = subtotal * currentTaxRate;
    const shippingAmount = totalQuantity * 10.00;
    const totalAmount = subtotal + taxAmount + shippingAmount;

    return {
        subtotal,
        currentTaxRate,
        taxAmount,
        shippingAmount,
        totalAmount
    };
};
