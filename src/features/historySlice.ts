import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

interface HistoryItem {
  id: string;
  original: string;
  optimized: string;
  date: string;
  time: string;
  samplesBefore: { x: number; y: number }[];
  samplesAfter: { x: number; y: number }[];
}

interface HistoryState {
  items: HistoryItem[];
}

const initialState: HistoryState = {
  items: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem(state, action: PayloadAction<Omit<HistoryItem, 'id'>>) {
      state.items.push({
        id: Date.now().toString(),
        ...action.payload,
      });
    },
  },
});

export const { addHistoryItem } = historySlice.actions;
export default historySlice.reducer;
