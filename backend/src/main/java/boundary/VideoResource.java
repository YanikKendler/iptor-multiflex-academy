package boundary;

import dtos.VideoDetailDTO;
import dtos.VideoOverviewDTO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import model.Video;
import org.jboss.resteasy.reactive.RestResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repository.VideoRepository;

import java.io.File;
import java.io.InputStream;
import java.util.List;

@Path("video")
public class VideoResource {
    private static final Logger log = LoggerFactory.getLogger(VideoResource.class);
    @Inject
    VideoRepository repository;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/upload")
    public Response upload(@FormParam("file") InputStream uploadedInputStream, @QueryParam("filename") String filename) {
        try {
            repository.uploadVideo(uploadedInputStream, filename);

            return Response.ok().entity("{\"message\":\"File uploaded successfully\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e).build();
        }
    }

    //alternative with easier to grab metadata and nicer code but extremely buggy - most likely incompatible dependencies
    /*@POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/upload")
    public Response upload(@FormDataParam("file") FormDataBodyPart file) {
        System.out.println("upload " + file.getName());

        try {
            repository.uploadVideo(file.getValueAs(InputStream.class));

            return Response.ok().entity("{\"message\":\"File uploaded successfully\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e).build();
        }
    }*/

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createVideo(Video v){
        try {
            repository.create(v);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        List<VideoOverviewDTO> videos;
        try{
            videos = repository.getAll();
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(videos).build();
    }

    @GET
    @Path("{videoId: [0-9]+}")
    public Response getVideoDetails(@PathParam("videoId") Long videoId, @QueryParam("userId") Long userId){
        VideoDetailDTO videoDetailDTO;
        try{
            videoDetailDTO = repository.getVideoDetails(videoId, userId);
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
            video = repository.getById(id);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(video).build();
    }

    @GET
    @Produces(MediaType.MULTIPART_FORM_DATA)
    @Path("{videoId:[0-9]+}/getVideoFragment/{fileName}")
    public RestResponse<File> getVideoFragment(@PathParam("fileName") String fileName, @PathParam("videoId") Long videoId) {
        try {
            File file = repository.getVideoFragment(videoId, fileName);
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
            repository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateVideo(@PathParam("id") Long id, Video v){
        try{
            repository.update(v);
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
            repository.linkVideoFile(videoId, fileId);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
