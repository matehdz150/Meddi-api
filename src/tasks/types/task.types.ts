export type TaskQuery = {
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  startDate?: string;
  endDate?: string;
  sort?: 'asc' | 'desc';
};