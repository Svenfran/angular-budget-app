import { Component, OnInit } from '@angular/core';
import { Asset } from 'src/app/models/asset';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'app-assetlist',
  templateUrl: './assetlist.component.html',
  styleUrls: ['./assetlist.component.scss']
})
export class AssetlistComponent implements OnInit {

  assetlist: Asset[] = [];

  constructor(private assetService: AssetService) { }

  ngOnInit(): void {
    this.listAssets();
  }

  listAssets() {
    this.assetService.getAssets().subscribe(
      data => {
        this.assetlist = data;
      }
    );
  }

}
