// 学习进度存储
const Storage = {
  KEY: 'sd_interview_progress',

  get() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : { mastered: [], current: 0 };
    } catch (e) {
      return { mastered: [], current: 0 };
    }
  },

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  },

  markMastered(id) {
    const data = this.get();
    if (!data.mastered.includes(id)) {
      data.mastered.push(id);
      this.save(data);
    }
  },

  unmarkMastered(id) {
    const data = this.get();
    data.mastered = data.mastered.filter(i => i !== id);
    this.save(data);
  },

  isMastered(id) {
    return this.get().mastered.includes(id);
  },

  setCurrent(index) {
    const data = this.get();
    data.current = index;
    this.save(data);
  },

  getCurrent() {
    return this.get().current || 0;
  },

  getMasteredCount() {
    return this.get().mastered.length;
  },

  reset() {
    this.save({ mastered: [], current: 0 });
  }
};
