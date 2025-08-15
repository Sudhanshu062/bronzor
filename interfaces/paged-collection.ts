interface IPagedCollection<T> extends IHydraResource {
    "hydra:totalItems": number;
    "hydra:member": T[];
}
