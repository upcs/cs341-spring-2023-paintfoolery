import Database from '../database-communication/database.js'
import TimeCardStart from '../comps/TimeCardStart.js';
test('Testing if checkClockImn grabs the correct info', function(){
    const userID = "EE7m2MQCr73UWlvo9Sy5"
    temp = new TimeCardStart();
    db = new Database();
    let data = db.isClockedIn(userID).then((res, rej) => {
        expect(res[0]).not.toBe(undefined);
        length = res.length;
        expect(length).toBeLessThanOrEqual(3);
        date = ['', ''];
        same = true;
        res.forEach(element => {
            if (date[0] == '' && date[1] == ''){
                date[0] = element.month;
                date[1] = element.day;
                return
            }
            else if(date[0] != element.month || date[1] != element.day){
                same = false
            }
        });
        expect(same).toBe(true);
    })
})