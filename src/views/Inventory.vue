<template lang="pug">
v-content
    v-container(fluid)
        v-row
            v-col
                v-toolbar
                    v-toolbar-title Inventory
                    v-spacer
                    form-new
        v-row
            v-col
                v-card
                    v-card-title <!-- data.length? -->
                        v-spacer
                        v-text-field(
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                        )
                    v-data-table(
                        :headers="headers"
                        :items="inventoryItems"
                        :items-per-page="20"
                        :search="search"
                        class="elevation-1"
                        :loading="this.$store.getters.loaderState"
                        loading-text="Searching inventory"
                        no-data-text="No objects matching request"
                    )
                        //-template(v-slot:item.description="{ item }")
                            v-btn(
                                text
                                @click="openDoc(item)"
                            )
                                v-icon mdi-text
                            span(v-text="item.description")

</template>

<script>
import FormNew from '@/components/inventory/FormNew.vue'

export default {
    name: 'Inventory',
    components: {
        FormNew
    },
    data: () => ({
        inventoryItems: [],
        search: null,
        headers: [
            { text: 'Label', value: 'name' },
        ]
    }),
    computed: {
    },
    created: function () {
    },
    mounted () {
        this.$store.dispatch('getInventory')
    },
    beforeDestroy() {
    },
    methods: {
        getInventory: async function (type) {
            const v = this.$store;
            //context.commit('flushData');
            v.commit('loaderActive');
            console.log('Inventory prints this',type); //placeholder to avoid EsLint
            const mango = {
                "selector": {
                    "realm": "inventory"
                    //"type": type
                    //"type": "transaction"
                },
                "limit": 100
            };
            try {
                let data = await window.db.find(mango);
                this.inventoryItems = data.docs;
                //vstore.commit('addNotes', data)
            } catch (error) {
                v.dispatch("infoBridge", { color:'error', text: error, level:'error' });
            }
            v.commit('loaderInactive');
        }
    }
}

/*

create table sale (
  saledate date not null,
  product_id integer not null references product,
  quantity integer not null,
  price decimal(6,2) not null,
  primary key (saledate, product_id)
);


id
cost
price
description

type: book, jeans

author
artist
title


Sites
id
site_code
Site_name

Warehouse
id
site_id
warehouse_code
warehouse_name

Item Category
id
category_code
category_name

Item Group
id
group_code
group_name

Generic Product
id
generic_name

Product
id
product_code
category_id
group_id
brand_id
generic_id
model_id/part_id
product_name
product_description
product_price (current rate)
has_instances(y/n)
has_lots (y/n)
has_attributes
default_uom
pack_size
average_cost
single_unit_product_code (for packs)
dimension_group (pointing to dimensions)
lot_information
warranty_terms (general not specific)
is_active
deleted

product attribute type (color/size etc.)
id
attribute_name
product_attribute
id
product_id
attribute_id

product attribute value (this product -> red)
id
product_attribute_id
value

product_instance
id
product_id
instance_name (as given by manufacturer)
serial_number
brand_id (is this brand)
stock_id (stock record pointing qih, location etc.)
lot_information (lot_id)
warranty_terms
product attribute value id (if applicable)

product lot
id
lot_code/batch_code
date_manufactured
date_expiry
product attribute value id (if applicable)

Brand
id
manufacturer_id
brand_code
brand_name

Brand Manufacturer
id
manufacturer_name

Stock
id
product_id
warehouse_id, zone_id, level_id, rack_id etc.
quantity in hand
product attribute value id (if applicable) [we have 4 red color items etc.]
Product Price Records
product_id
from_date
product_price

Purchase Order Header
id
supplier_id
purchase_date
total_amount

Purchase Order Line
id
po_id
product_id
unit_price
quantity

Supplier
id
supplier_code
supplier_name
supplier_type

product_uom
id
uom_name

product_uom_conversion
id
from_uom_id
to_uom_id
conversion_rule

serialNumber
color
doorCount

serialNumber
manufacturer
value
quantity



*/
</script>