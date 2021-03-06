import { isValidUrl } from '../tools/validator';
import normalizer from '../tools/normalizer';
import { addOne } from './watchlist';
import getter from './getter';

const createNewEntry = normalized => (
    {
        repository: normalized.repository,
        url: normalized.url,
        last_updated: normalized.updated_at,
        last_check_at: null
    }
);

module.exports = async (db, url) => {
    if (!url || !isValidUrl(url)) {
        throw new Error(`Invalid URL given: ${url}`);
    }

    const processedXml = await getter(url);
    if (!processedXml) {
        throw new Error(`Error fetching URL: ${url}`);
    }

    const normalized = normalizer(processedXml);
    if (!normalized) {
        throw new Error(`Error normalizing processing URL: ${url}`);
    }

    const entry = createNewEntry(normalized);

    try {
        const result = await addOne(db, entry);
        if (!result) {
            throw new Error(`${entry.repository} failed to be added to the list`);
        }

        return entry;
    } catch (err) {
        if (err.code === 11000) {
            throw new Error(`${entry.repository} already exists`);
        }

        throw err;
    }
};