import { FormatingDatePipe } from './formating-date.pipe';

describe('FormatingDatePipe', () => {
  it('create an instance', () => {
    const pipe = new FormatingDatePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return date in month and year format',()=>{
    const pipe= new FormatingDatePipe()
    expect(pipe.transform('1998-08-29')).toEqual('08/98')
  })
});
