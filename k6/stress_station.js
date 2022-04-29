import http from 'k6/http';
import { Rate } from 'k6/metrics';
import { sleep } from 'k6';

export const RateContentCreated = new Rate('Content Created');

export const options = {
    stages: [
        { duration: '2m', target: 10 },
        { duration: '2m', target: 210 },
        { duration: '2m', target: 430 },
        { duration: '2m', target: 430 },
        { duration: '2m', target: 210 },
        { duration: '2m', target: 50 },
        { duration: '2m', target: 10 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(99) < 75'],
        http_req_failed: ['rate < 0.01'],
        'Content Created': ['rate > 0.99']
    },
};

const TEST_NAME_PREFIX = "test_";
const BASE_URL = 'https://shineoov.p-e.kr';

export default () => {
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const payload = JSON.stringify({
        name: TEST_NAME_PREFIX + new Date().getTime() + parseInt(Math.random() * 100000 + 1)
    });

    const response = http.post(`${BASE_URL}/stations`, payload, params);
    const contentOk = response.status === 201;
    RateContentCreated.add(contentOk);
    sleep(1)
};
