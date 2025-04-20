export const openModal = (ref:any) => {
    if (ref.current) {
        ref.current.showModal();
    }
};

export const closeModal = (ref:any) => {
    if (ref.current) {
        ref.current.close();
    }
};
