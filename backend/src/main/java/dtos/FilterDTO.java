package dtos;

import enums.VisibilityEnum;
import model.Tag;

import java.util.List;

public record FilterDTO(List<Tag> tags){
}
