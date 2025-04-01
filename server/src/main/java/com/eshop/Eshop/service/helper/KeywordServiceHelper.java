package com.eshop.Eshop.service.helper;

import com.eshop.Eshop.model.Keyword;
import com.eshop.Eshop.repository.KeywordsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class KeywordServiceHelper {

    @Autowired
    private KeywordsRepo keywordsRepo;

    public Set<Keyword> getKeywordsByStringSet(Set<String> words) {
        try {
            return words.stream().map(word -> keywordsRepo.findByWordIgnoreCase(word)
                    .orElseGet(() -> {
                        Keyword newKeyword = new Keyword();
                        newKeyword.setWord(word);
                        return keywordsRepo.save(newKeyword);
                    })).collect(Collectors.toSet());

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error keywordServiceHelper-getkeywordsByStringSet");
        }
    }
}
