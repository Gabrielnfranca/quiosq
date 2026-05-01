export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  address: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
}
