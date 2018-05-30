package com.eshop.services;

import com.eshop.dao.ProductDAO;
import com.eshop.dao.ProductImageDAO;
import com.eshop.dao.PropertyDAO;
import com.eshop.entities.Product;
import com.eshop.entities.Property;
import com.eshop.exceptions.ProductNotFoundException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;


@Service
public class ProductService {

    @Autowired
    private ProductImageService productImageService;

    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private PropertyDAO propertyDAO;

    @Autowired
    private ProductImageDAO productImageDAO;

    @Autowired
    private PropertyService propertyService;

    public Product create(Product product){
        Product newProduct = productDAO.save(product);
        for(Property p : product.getProductProperties()){
            p.setProduct(newProduct);
        }
        propertyService.create(product.getProductProperties());

        product.setDateCreated(LocalDateTime.now());
        return newProduct;
    }

    @Transactional
    public Iterable<Product> createAll(Iterable<Product> products) {
        for(Product product : products) {
            create(product);
            propertyDAO.saveAll(product.getProductProperties());
            productImageDAO.saveAll(product.getProductImages());
        }
        return products;
    }

    public List<Product> findAll() {
        return productDAO.findAll();
    }

    public Product findById(Integer id) throws ProductNotFoundException {
        Product product = productDAO.findById(id).orElse(null);
        if (product == null) {
            throw new ProductNotFoundException();
        } else {
            return product;
        }
    }

    public Product update(Product product) {
        List<Integer> propertiesIds = getIds(product.getProductProperties());
        for(Property prop : propertyService.getProperties(product.getId())){
            if(!propertiesIds.contains(prop.getId())){
                propertyService.delete(prop.getId());
            }
        }
        Product updateProduct = productDAO.save(product);
        for(Property p : product.getProductProperties()){
            p.setProduct(updateProduct);
        }

        propertyService.create(product.getProductProperties());


        return updateProduct;
    }

    public void deleteById(Integer id) throws ProductNotFoundException {
        //productDAO.deleteById(id);
        try {
            Product delProduct = findById(id);
            delProduct.setDeleted(true);
            productDAO.save(delProduct);

        } catch (ProductNotFoundException e) {
            throw e;
        }

    }

    private List<Integer> getIds(final List<Property> dummyList)
    {
        List<Integer> ids = new ArrayList<Integer>();
        for(Property dummy: dummyList){
            ids.add(dummy.getId());
        }
        return ids;
    }

    public List<Product> importProducts(MultipartFile file) {

        List<Product> products = new ArrayList<>();
        try {
            Workbook workbook = WorkbookFactory.create(file.getInputStream());
            DataFormatter dataFormatter = new DataFormatter();

            //Assume that xlsx document will always contain one sheet.
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.rowIterator();
            List<CellRangeAddress> mergedRegions = sheet.getMergedRegions();
            Product product = null;
            Property property = null;
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                Iterator<Cell> cellIterator = row.cellIterator();
                while (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();
                    if(isValueCell(cell, mergedRegions) && cell.getRowIndex() > 0) {
                        String cellValue = dataFormatter.formatCellValue(cell);
                        int columnIndex = cell.getColumnIndex();
                        switch(columnIndex){
                            case 0 :
                                //product name
                                if(product != null && !products.contains(product)) {
                                    products.add(product);
                                }
                                product = new Product();
                                product.setProductProperties(new ArrayList<>());
                                product.setProductImages(new ArrayList<>());
                                product.setName(cellValue);
                                product.setQuantity(0);
                                break;
                            case 1 :
                                //title
                                product.setTitle(cellValue);
                                break;
                            case 2 :
                                //price
                                cellValue = cellValue.replace(',', '.');
                                product.setPrice(new BigDecimal(cellValue));
                                break;
                            case 3 :
                                //image
                                List<String> urlList = Arrays.asList(cellValue.split(","));
                                for(String url : urlList) {
                                    product.getProductImages().add(productImageService.create(product, url));
                                }
                                break;
                            case 4 :
                                //SKU code
                                product.setSkuCode(cellValue);
                                break;
                            case 5 :
                                //description
                                product.setDescription(cellValue);
                                break;
                            case 6 :
                                //category
                                break;
                            case 7 :
                                //property key
                                property = new Property();
                                property.setProduct(product);
                                property.setName(cellValue);
                                break;
                            case 8 :
                                //property val
                                property.setValue(cellValue);
                                product.getProductProperties().add(property);
                                break;
                            default:
                                break;
                        }
                        System.out.println(cellValue);
                    }
                }
            }
            if(product != null && !products.contains(product)) {
                products.add(product);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return (List)createAll(products);
    }

    private boolean isValueCell(Cell cell, List<CellRangeAddress> range) {
        for (CellRangeAddress region : range) {
            boolean isInRange = region.isInRange(cell);
            if (isInRange && region.getFirstRow() == cell.getRowIndex() && region.getFirstColumn() == cell.getColumnIndex()) {
                return true;
            }
            else if(isInRange) {
                return false;
            }
        }
        return true;
    }
}
