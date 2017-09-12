import * as sinon from 'sinon';

const mockGetUSDT = (): sinon.SinonStub => sinon.stub().returns(2.00);
const mockGetUSDKRW = (): sinon.SinonStub => sinon.stub().returns(1000);

export {
    mockGetUSDT,
    mockGetUSDKRW,
};
