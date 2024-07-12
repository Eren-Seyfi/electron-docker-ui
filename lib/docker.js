const axios = require("axios");
const Logger = require("./logger");

const logger = new Logger();

async function docker(query, from = "0", size = "20") {
  const url = `https://hub.docker.com/api/search/v3/catalog/search?query=${query}&from=${from}&size=${size}`;

  try {
    const response = await axios.get(url);
    // Başarıyı işleme
    logger.info("API request successful");
    logger.info(`Response data: ${JSON.stringify(response.data)}`);

    // Rate plans'leri içeren sonuçları döndürme
    const resultsWithRatePlans = response.data.results.map((result) => ({
      id: result.id,
      name: result.name,
      slug: result.slug,
      type: result.type,
      publisher: result.publisher,
      created_at: result.created_at,
      updated_at: result.updated_at,
      short_description: result.short_description,
      source: result.source,
      star_count: result.star_count,
      rate_plans: result.rate_plans,
      logo_url: result.logo_url,
      extension_reviewed: result.extension_reviewed,
      categories: result.categories,
    }));

    return resultsWithRatePlans;
  } catch (error) {
    // Hataları işleme
    logger.error(`API request failed: ${error.message}`);
    throw error;
  }
}

// docker fonksiyonunu çalıştırma ve sonucu yazdırma

module.exports = docker;
