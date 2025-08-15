interface IResponse<R = undefined> {
    config: any;
    data: R;
    headers: any;
    request: any;
    status: number;
    statusText: string;
}