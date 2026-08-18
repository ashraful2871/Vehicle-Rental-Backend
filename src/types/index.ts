export interface Staff {
  id: number;
  email: string;
  password_hash: string;
  name: string;
}

export interface jwtPayload {
  id: number;
  email: string;
}

export interface Vehicle {
  id: number;
  name: string;
  plate_number: string;
  category: string;
  daily_rate: number;
  photo_path: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateVehicleDTO {
  name: string;
  plate_number: string;
  category: string;
  daily_rate: number;
  photo_path?: string;
}

export interface Rental {
  id: number;
  vehicle_id: number;
  customer_name: string;
  customer_phone: string;
  start_date: Date | string;
  end_date: Date | string;
  total_amount: number;
  status: "booked" | "ongoing" | "completed" | "cancelled";
  created_at: Date;
  updated_at: Date;
}

export interface CreateRentalDTO {
  vehicle_id: number;
  customer_name: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
}

export interface UpdateRentalDTO extends Partial<CreateRentalDTO> {
  status?: "booked" | "ongoing" | "completed" | "cancelled";
}

export interface UpdateVehicleDTO extends Partial<CreateVehicleDTO> {}
