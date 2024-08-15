package dtos;

import enums.VisibilityEnum;
import model.Question;

import java.util.List;

public record CreateVideoDTO(String title, String description, List<Integer> tags, String color, VisibilityEnum visibility, List<Question> questions) {
}
