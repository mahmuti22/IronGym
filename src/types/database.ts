export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      customer_profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          default_address: string | null;
          default_city: string | null;
          default_postcode: string | null;
          default_country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          default_address?: string | null;
          default_city?: string | null;
          default_postcode?: string | null;
          default_country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          default_address?: string | null;
          default_city?: string | null;
          default_postcode?: string | null;
          default_country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          group_slug: string | null;
          status: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          group_slug?: string | null;
          status?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          group_slug?: string | null;
          status?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          hero_image_url: string | null;
          status: string;
          tags: string[];
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          hero_image_url?: string | null;
          status?: string;
          tags?: string[];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          hero_image_url?: string | null;
          status?: string;
          tags?: string[];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          price: number;
          sale_price: number | null;
          category_id: string | null;
          subcategory_id: string | null;
          gender: string;
          short_description: string | null;
          long_description: string | null;
          material: string | null;
          fit: string | null;
          care_instructions: string | null;
          sizes: string[];
          colors: string[];
          tags: string[];
          status: string;
          stock_status: string;
          main_image_url: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          price: number;
          sale_price?: number | null;
          category_id?: string | null;
          subcategory_id?: string | null;
          gender?: string;
          short_description?: string | null;
          long_description?: string | null;
          material?: string | null;
          fit?: string | null;
          care_instructions?: string | null;
          sizes?: string[];
          colors?: string[];
          tags?: string[];
          status?: string;
          stock_status?: string;
          main_image_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          price?: number;
          sale_price?: number | null;
          category_id?: string | null;
          subcategory_id?: string | null;
          gender?: string;
          short_description?: string | null;
          long_description?: string | null;
          material?: string | null;
          fit?: string | null;
          care_instructions?: string | null;
          sizes?: string[];
          colors?: string[];
          tags?: string[];
          status?: string;
          stock_status?: string;
          main_image_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_collections: {
        Row: {
          product_id: string;
          collection_id: string;
        };
        Insert: {
          product_id: string;
          collection_id: string;
        };
        Update: {
          product_id?: string;
          collection_id?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_first_name: string;
          customer_last_name: string;
          customer_email: string;
          customer_phone: string | null;
          shipping_address: string;
          shipping_city: string;
          shipping_postcode: string;
          shipping_country: string;
          customer_notes: string | null;
          customer_id: string | null;
          internal_notes: string | null;
          tracking_number: string | null;
          shipping_carrier: string | null;
          subtotal: number;
          shipping_total: number;
          discount_total: number;
          total: number;
          currency: string;
          status: string;
          payment_status: string;
          payment_method: string | null;
          payment_provider: string | null;
          stripe_session_id: string | null;
          stripe_payment_intent_id: string | null;
          stripe_customer_id: string | null;
          paid_at: string | null;
          shipped_at: string | null;
          completed_at: string | null;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_first_name: string;
          customer_last_name: string;
          customer_email: string;
          customer_phone?: string | null;
          shipping_address: string;
          shipping_city: string;
          shipping_postcode: string;
          shipping_country: string;
          customer_notes?: string | null;
          customer_id?: string | null;
          internal_notes?: string | null;
          tracking_number?: string | null;
          shipping_carrier?: string | null;
          subtotal?: number;
          shipping_total?: number;
          discount_total?: number;
          total?: number;
          currency?: string;
          status?: string;
          payment_status?: string;
          payment_method?: string | null;
          payment_provider?: string | null;
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_customer_id?: string | null;
          paid_at?: string | null;
          shipped_at?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_first_name?: string;
          customer_last_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          shipping_address?: string;
          shipping_city?: string;
          shipping_postcode?: string;
          shipping_country?: string;
          customer_notes?: string | null;
          customer_id?: string | null;
          internal_notes?: string | null;
          tracking_number?: string | null;
          shipping_carrier?: string | null;
          subtotal?: number;
          shipping_total?: number;
          discount_total?: number;
          total?: number;
          currency?: string;
          status?: string;
          payment_status?: string;
          payment_method?: string | null;
          payment_provider?: string | null;
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_customer_id?: string | null;
          paid_at?: string | null;
          shipped_at?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_slug: string;
          product_name: string;
          product_image_url: string | null;
          selected_size: string | null;
          selected_color: string | null;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_slug: string;
          product_name: string;
          product_image_url?: string | null;
          selected_size?: string | null;
          selected_color?: string | null;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_slug?: string;
          product_name?: string;
          product_image_url?: string | null;
          selected_size?: string | null;
          selected_color?: string | null;
          unit_price?: number;
          quantity?: number;
          line_total?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type DbAdminProfile =
  Database["public"]["Tables"]["admin_profiles"]["Row"];
export type DbCustomerProfile =
  Database["public"]["Tables"]["customer_profiles"]["Row"];
export type DbCategory = Database["public"]["Tables"]["categories"]["Row"];
export type DbCollection = Database["public"]["Tables"]["collections"]["Row"];
export type DbProduct = Database["public"]["Tables"]["products"]["Row"];
export type DbProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type DbOrder = Database["public"]["Tables"]["orders"]["Row"];
export type DbOrderItem = Database["public"]["Tables"]["order_items"]["Row"];
