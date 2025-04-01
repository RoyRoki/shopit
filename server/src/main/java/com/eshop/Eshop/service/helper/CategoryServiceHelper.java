package com.eshop.Eshop.service.helper;

import com.eshop.Eshop.model.Category;
import com.eshop.Eshop.repository.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CategoryServiceHelper {

    @Autowired
    private CategoryRepo categoryRepo;

    public Set<Category> getCategorySetByIdSet(Set<Long> ids) {
        if(ids.isEmpty())
                return Set.of();
        Set<Category> categories = categoryRepo.findAllById(ids)
                .stream().collect(Collectors.toSet());

        // If any of the categories are missing
        if(categories.size() != ids.size()) {
            Set<Long> foundIds = categories.stream()
                    .map(Category::getId)
                    .collect(Collectors.toSet());

            ids.stream().filter(id -> !foundIds.contains(id))
                    .forEach(id -> {
                        throw new RuntimeException("Category Not Found With Id "+id);
                    });
        }

        return categories;
    }

}
