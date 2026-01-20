// create a feature flag interface for local development
interface FeatureFlags {
  disable_article_logs: {
    enabled: boolean;
    description: string;
    last_updated: string;
  };
}

const featureFlags: FeatureFlags = {
    disable_article_logs: {
      "enabled": false,
      "description": "When enabled, suppresses verbose article processing logs",
      "last_updated": "2025-07-26",
    }
};



export default featureFlags;
