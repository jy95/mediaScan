import {parse as nameParser} from 'parse-torrent-title';
import {folders, MediaScan} from '../__helpers__/_constants';

// TESTS
/** @test {MediaScan#scan} */
test('Scan without user provided paths', async () => {
    let libInstance = new MediaScan();
    const eventSpy = jest.spyOn(libInstance, 'scan');
    await expect(libInstance.scan().resolves);
    expect(eventSpy).toHaveBeenCalled();
    expect(eventSpy).toHaveBeenCalledTimes(1);
});

/** @test {MediaScan#scan} */
test('Scan with user provided paths', async () => {
    let libInstance = new MediaScan();
    const eventSpy = jest.spyOn(libInstance, 'scan');
    // whatever path that should exists
    await expect(libInstance.addNewPath(...folders).resolves);
    await expect(libInstance.scan().resolves);
    expect(eventSpy).toHaveBeenCalled();
    expect(eventSpy).toHaveBeenCalledTimes(1);
});

// test to handle default parameters
/** @test {MediaScan#scan} */
test('Scan with user provided paths and custom parser', async () => {
    let libInstance = new MediaScan({}, {parser: nameParser});
    const eventSpy = jest.spyOn(libInstance, 'scan');
    // whatever path that should exists
    await expect(libInstance.addNewPath(...folders).resolves);
    await expect(libInstance.scan().resolves);
    expect(eventSpy).toHaveBeenCalled();
    expect(eventSpy).toHaveBeenCalledTimes(1);
});

/** @test {MediaScan#scan} */
test('Scan with user provided paths and wrong custom parser', async () => {
    let libInstance = new MediaScan({}, {parser: {}});
    const eventSpy = jest.spyOn(libInstance, 'scan');
    // whatever path that should exists
    await expect(libInstance.addNewPath(...folders).resolves);
    await expect(libInstance.scan().rejects);
    expect(eventSpy).toHaveBeenCalled();
    expect(eventSpy).toHaveBeenCalledTimes(1);
});
