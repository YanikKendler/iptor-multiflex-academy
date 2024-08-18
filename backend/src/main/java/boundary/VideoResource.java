package boundary;

import dtos.CreateVideoDTO;
import dtos.EditVideoDTO;
import dtos.VideoDetailDTO;
import enums.VisibilityEnum;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import model.Video;
import org.jboss.resteasy.reactive.RestResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repository.VideoFileRepository;
import repository.VideoRepository;

import java.io.File;

@Path("video")
public class VideoResource {
    private static final Logger log = LoggerFactory.getLogger(VideoResource.class);
    @Inject
    VideoRepository videoRepository;

    @Inject
    VideoFileRepository videoFileRepository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createVideo(CreateVideoDTO v){
        try {
            Video video = videoRepository.create(v);

            return Response.ok().build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Path("{videoId: [0-9]+}")
    public Response getVideoDetails(@PathParam("videoId") Long videoId, @QueryParam("userId") Long userId){
        VideoDetailDTO videoDetailDTO;
        try{
            videoDetailDTO = videoRepository.getVideoDetailsForUser(videoId, userId);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(videoDetailDTO).build();
    }

    @GET
    @Path("{id: [0-9]+}")
    public Response getVideo(@PathParam("id") Long id){
        Video video;
        try{
            video = videoRepository.getById(id);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(video).build();
    }

    @GET
    @Produces(MediaType.MULTIPART_FORM_DATA)
    @Path("{videoId:[0-9]+}/videofile/{fileName}")
    public RestResponse<File> getVideoFragment(@PathParam("fileName") String fileName, @PathParam("videoId") Long videoId) {
        try {
            File file = videoFileRepository.getVideoFragment(videoId, fileName);
            return RestResponse.ResponseBuilder.ok(file)
                    .header("Content-Disposition", "attachment; filename=\""+ fileName +"\"")
                    .build();
        }
        catch (NullPointerException e){
            //return RestResponse.ResponseBuilder.notFound().build();
            return null;
        }
        catch (Exception e){
            e.printStackTrace();
            //return RestResponse.ResponseBuilder.serverError().build();
            return null;
        }
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteVideo(@PathParam("id") Long id){
        try{
            videoRepository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateVideo(EditVideoDTO video){
        try{
            System.out.println(video.toString());

            VideoDetailDTO videoDetailDTO = videoRepository.update(video);

            return Response.ok(videoDetailDTO).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @PUT
    @Path("{videoId: [0-9]+}/visibility")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateVisibility(@PathParam("videoId") Long videoId, JsonObject v){
        try{
            System.out.println(v);
            videoRepository.updateVideoVisibility(videoId, VisibilityEnum.valueOf(v.getString("visibility")));
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{videoId: [0-9]+}/linkVideoFile/{fileId: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response linkVideoFile(@PathParam("videoId") Long videoId, @PathParam("fileId") Long fileId){
        try{
            videoRepository.linkVideoFile(videoId, fileId);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
