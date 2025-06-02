const sanitize = (data, excludeFields=[]) => {
    if (!data) return data;
    if (Array.isArray(data)) {
      return data.map((item) => sanitize(item, excludeFields));
    }
    const sanitized = { ...data };
    excludeFields.forEach((field) => delete sanitized[field]);
    return sanitized;
};
module.exports = sanitize;
