import { FirstlettercapPipe } from './firstlettercap.pipe';

describe('FirstlettercapPipe', () => {
  it('create an instance', () => {
    const pipe = new FirstlettercapPipe();
    expect(pipe).toBeTruthy();
  });

  it('it should return a string with first letter capital',()=>{
    const pipe=new FirstlettercapPipe()
    expect(pipe.transform('testing')).toEqual('Testing')
  })
});
