<?php
	/**
	* Author - ammar
	* Description - Created api for angular cms
	*/
	class api
	{
		public $db;
		function __construct()
		{
			$hostname="localhost";
			$username= "root";
			$password= "";
			$dbName="test";
			$this->db = new mysqli($hostname,$username,$password,$dbName);
			if($this->db->connect_error){
				die("Connection failed: " . $db->connect_error);
			}
		}
		function insert($vTablename, $aInsert= array()){
			$count = 0;
			$fields = '';
			foreach($aInsert as $col => $val) {
				if ($count++ != 0) $fields .= ', ';
				$col = mysql_real_escape_string($col);
				$val = mysql_real_escape_string($val);
				$fields .= "`$col` = '$val'";
			}
			$sql = "INSERT INTO `$vTablename` SET $fields";
			//echo $sql;
			if ($this->db->query($sql) === TRUE) {
			    return "Success";
			} else {
			    return "Error Insert Table: " . $this->db->error;
			}
		}
		function update ($vTablename, $aUpdate= array(), $sWhere){
			$count = 0;
			$fields = '';
			foreach($aUpdate as $col => $val) {
				if ($count++ != 0) $fields .= ', ';
				$col = mysql_real_escape_string($col);
				$val = mysql_real_escape_string($val);
				$fields .= "`$col` = '$val' ";
			}

			$sql = "UPDATE `$vTablename` SET $fields ";
			$count = 0;
			$fields = '';
			foreach($aUpdate as $col => $val) {
				if ($count++ != 0) $fields .= ', ';
				$col = mysql_real_escape_string($col);
				$val = mysql_real_escape_string($val);
				$fields .= "`$col` = $val";
			}
			$sql .=  " WHERE $sWhere"; 
			// echo $sql;
			if ($this->db->query($sql) === TRUE) {
			    return "Success";
			} else {
			    return "Error Update Table: " . $this->db->error;
			}
		}
		function fetch ($vTablename, $sColumnNames='', $sWhere ='' ){
			$sql = '';
			if($sColumnNames != ''){
				$sql .= "SELECT ".$sColumnNames;
			}else{
				$sql .= "SELECT *";
			}
			$sql .= " FROM ".$vTablename;
			if($sWhere != ''){
				$sql .= " WHERE ".$sWhere;
			}
			$result = $this->db->query($sql);
			$return = array();
			$i=0;
		 	while ($row = mysqli_fetch_assoc($result)) {
		        $return[$i]['section_name'] = $row['section_name'];
		        $return[$i]['section_id'] = $row['section_id'];
		        $i++;
		    }
			return $return;
		}

	}
	$postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
	// echo "<pre>";
	// print_r($request);
	// exit;
	$oApi = new api();
	if($request){
		$action = $request->action;
		$aParams = array();
		if($action == "section_add"){
			$aParams['section_name'] = $request->section_name;
			$aParams['created_at'] = date('Y-m-d H:i:s');
			$aParams['updated_at'] = date('Y-m-d H:i:s');
			// $aParams['parent_id'] = $_POST['parent_id'];
			$result['response'] = $oApi->insert("section_mst", $aParams);
			echo json_encode($result);
		}
		else if($action == 'get_sections'){
			echo json_encode($oApi->fetch('section_mst','section_name,section_id'));
		}
		else if($action == 'section_edit'){
			$aParams['section_name'] = $request->section_name;
			$aParams['updated_at'] = date('Y-m-d H:i:s');
			// $aParams['parent_id'] = $_POST['parent_id'];
			$result['response'] = $oApi->update("section_mst", $aParams, "section_id=$request->section_id");
			echo json_encode($result);
		}

	}

?>