class ResponseSuccess {
  public readonly data: any;

  public readonly statusCode: number;

  public readonly status: boolean;

  public readonly timestamp: number;

  constructor(data: any) {
    this.data = data;
    this.statusCode = 200;
    this.status = true;
    this.timestamp = Date.now();
  }
}

export default ResponseSuccess;
