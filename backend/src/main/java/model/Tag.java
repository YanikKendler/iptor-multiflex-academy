package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;

import java.util.Set;

@Entity
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagId;

    private String name;

    @ManyToMany(mappedBy = "tags", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Set<Content> usageList;

    public Tag (String name){
        this.name = name;
    }

    public Tag() {
    }

    public Long getTagId() {
        return tagId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Content> getUsageList() {
        return usageList;
    }

    public void setUsageList(Set<Content> usageList) {
        this.usageList = usageList;
    }
}
