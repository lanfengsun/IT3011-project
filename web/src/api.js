import axios from 'axios';

const BASE_URI = 'http://localhost:4433';

const client = axios.create({
    baseURL: BASE_URI,
    json: true
});


class APIClient {
    getPlayers(limit, orderBy) {
        let url = '/players?';
        if (limit) {
            url += `limit=${limit}`;
        }
        if (orderBy) {
            url += `sort=${orderBy}`;
        }
        return this.perform('get', url)
    }

    calculate(opponent, myTeam) {
        return this.perform(
            'post',
            '/calculate',
            { opponent, myTeam }
        );
    }

    async perform(method, url, data) {
        try {
            const resp = await client({
                method,
                url,
                data
            });
            return resp.data ? resp.data : [];
        } catch (err) {
            console.log(err);
            return [];
        }
    }
}

export default APIClient;
