
export const calculateFinalPrice = (price: number, discount: number): number => {
    return price - (price * discount) / 100;
};
