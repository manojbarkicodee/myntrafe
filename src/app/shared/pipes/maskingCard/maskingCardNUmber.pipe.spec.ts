// import { MaskingCardNumberPipe } from './formating-date.pipe';

import { MaskingCardNumberPipe } from "./maskingCardNUmber.pipe";

describe('MaskingCardNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new MaskingCardNumberPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return card number in masked format',()=>{
    const pipe= new MaskingCardNumberPipe()
    expect(pipe.transform('1234567890123456')).toEqual('XXXX XXXX XXXX 3456')
  })
});
